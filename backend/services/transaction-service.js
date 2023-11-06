import Transaction from "../models/transactionSchema.js";

export const createTransaction = async (request) => {
    const { title, amount, category, description, transactionType, date, user } = request;
    const transaction = await Transaction.create({
        title,
        amount,
        category,
        description,
        transactionType,
        date,
        user
    });
    if (!transaction) return null;
    return transaction;
}

export const getAllTransaction = async (query) => {
    return await Transaction.find(query);
}

export const getTransactionById = async (id) => {
    const transaction = await Transaction.findById(id);
    if (!transaction) return null;
    return transaction;
}

export const updateTransactionById = async (id, request) => {
    const where = [];
    where.push({id: id});

    const transaction = await Transaction.findById(id);
    transaction.updateOne(request);

    return transaction;
}

export const deleteTransactionById = async (id) => {
    const transaction = await Transaction.findById(id);
    if (!transaction) return false;
    await transaction.deleteOne();
    return true;
}