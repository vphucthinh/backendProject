// services/orderService.js

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import BaseService from "./baseService.js";
import paginationMapper from "../mappers/paginationMapper.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class OrderService extends BaseService {
    constructor({orderRepository}) {
        super(orderRepository, 'order', paginationMapper.toPagination);
        this.frontend_url = process.env.Client_URI || "http://localhost:5174";
        this.repo = orderRepository;
    }

    async createOrder(orderData) {
        const newOrder = this.repo.createAndSave(orderData);
        await this.repo.findByIdAndUpdate(orderData.userId, { cartData: {} });
        return newOrder;
    }

    async createStripeSession(order, items) {
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${this.frontend_url}/verify?success=true&orderId=${order._id}`,
            cancel_url: `${this.frontend_url}/verify?success=false&orderId=${order._id}`,
        });

        return session;
    }

    async verifyOrderPayment(orderId, success) {
        if (success === "true") {
            await this.repo.findByIdAndUpdate(orderId, { payment: true });
            return { success: true, message: "Paid" };
        } else {
            await this.repo.findByIdAndDelete(orderId);
            return { success: false, message: "Not Paid" };
        }
    }

    async getUserOrders(userId) {
        const orders = await this.repo.find({ userId });
        return orders;
    }

    async listOrders() {
        const orders = await this.repo.find({});
        return orders;
    }

    async updateOrderStatus(orderId, status) {
        await this.repo.findByIdAndUpdate(orderId, { status });
        return { success: true, message: "Status Updated" };
    }
}

export default OrderService;
