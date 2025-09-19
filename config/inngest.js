import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to a database - DESHABILITADA (ya no usamos Clerk)
// export const syncUserCreation = inngest.createFunction(
//     {
//         id: 'sync-user-from-clerk'
//     },
//     { event: 'clerk/user.created' },
//     async ({ event }) => {
//         // Función deshabilitada - ya no usamos Clerk
//     }
// )

// Inngest Function to update user data in database - DESHABILITADA (ya no usamos Clerk)
// export const syncUserUpdation = inngest.createFunction(
//     {
//         id: 'update-user-from-clerk'
//     },
//     { event: 'clerk/user.updated' },
//     async ({event}) => {
//         // Función deshabilitada - ya no usamos Clerk
//     }
// )

// Inngest Function to delete user from database - DESHABILITADA (ya no usamos Clerk)
// export const syncUserDeletion = inngest.createFunction(
//     {
//         id: 'delete-user-with-clerk'
//     },
//     { event: 'clerk/user.deleted' },
//     async ({event}) => {
//         // Función deshabilitada - ya no usamos Clerk
//     }
// )

// Inngest Function to create user's order in database
export const createUserOrder = inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        }
    },
    {event: 'order/created'},
    async ({events}) => {
        
        const orders = events.map((event)=> {
            return {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date : event.data.date
            }
        })

        await connectDB()
        await Order.insertMany(orders)

        return { success: true, processed: orders.length };

    }
)