import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class OrderController {
    constructor({orderService}) {
        this.service = orderService
    }

    /**
     * Place a new user order
     *
     * @param {Object} req - The request object containing userId, items, amount, and address
     * @param {Object} res - The response object
     */
    async placeOrder(req, res) {
        try {
            const newOrder = await this.service.createOrder({
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address
            });

            const session = await this.service.createStripeSession(newOrder, req.body.items);

            res.json({ success: true, session_url: session.url });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" });
        }
    }

    /**
     * Verify an order payment status
     *
     * @param {Object} req - The request object containing orderId and success
     * @param {Object} res - The response object
     */
    async verifyOrder(req, res) {
        try {
            const result = await this.service.verifyOrderPayment(req.body.orderId, req.body.success);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" });
        }
    }

    /**
     * Get all orders for a user
     *
     * @param {Object} req - The request object containing userId
     * @param {Object} res - The response object
     */
    async userOrders(req, res) {
        try {
            const orders = await this.service.getUserOrders(req.body.userId);
            res.json({ success: true, data: orders });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" });
        }
    }

    /**
     * List all orders for admin panel
     *
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     */
    async listOrders(req, res) {
        try {
            const orders = await this.service.listOrders();
            res.json({ success: true, data: orders });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" });
        }
    }

    /**
     * Update order status
     *
     * @param {Object} req - The request object containing orderId and status
     * @param {Object} res - The response object
     */
    async updateStatus(req, res) {
        try {
            const result = await this.service.updateOrderStatus(req.body.orderId, req.body.status);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" });
        }
    }
}

export default OrderController;
