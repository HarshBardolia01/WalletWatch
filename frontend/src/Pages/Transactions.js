import React from "react";
import { useState, useEffect } from "react";
import DataGrid, {
    Column,
    Editing,
    Popup,
    Paging,
    Lookup,
    Form,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import transactionData from "../Transaction-Data/transactionData";
import { Box } from "@mui/material";
import category from "../Transaction-Data/category";
import transactionType from "../Transaction-Data/transactionType";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { createTransactionApi, getTransactionsApi, updateTransactionApi, deteleTransactionApi } from "../utils/ApiRequests.js";

const notesEditorOptions = { height: 100 };
const Transactions = () => {
    const [redirect, updateRedirect] = useState(false);
    const [transactions, updateTransactions] = useState([]);
    const [frequency, updateFrequency] = useState("custom");
    const [type, updateType] = useState("all");
    const [startDate, updateStartDate] = useState(null);
    const [endDate, updateEndDate] = useState(null);
    const [currentUser, updateCurrentUser] = useState(null);

    useEffect(async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            updateRedirect(true);
        } else {
            const obj = JSON.parse(user);
            updateCurrentUser(obj);
            // try {
            //     console.log(obj);

            //     const { data } = await axios.post(getAllTransactionByUserId, {
            //         userId: obj.id,
            //     });

            //     console.log(data);
            //     updateTransactions(data.transactions);

            // } catch (error) {
            //     console.log(error.message);
            // }
        }
    }, []);

    const fetchTransaction = async () => {

        try {

            const { data } = await axios.post(getTransactionsApi, {
                userId: currentUser.id,
                frequency: frequency,
                startDate: startDate,
                endDate: endDate,
                transactionType: type,
            });

            updateTransactions(data.transactions);

        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchTransaction();
    }, [currentUser, frequency, endDate, type, startDate]);

    const addTransaction = async (event) => {
        try {
            const {
                title,
                amount,
                category,
                description,
                transactionType,
                date
            } = event.data;

            const response = await axios.post(createTransactionApi, {
                title: title,
                amount: amount,
                category: category,
                description: description,
                transactionType: transactionType,
                date: date,
                userId: currentUser.id
            });
        } catch (error) {
            // TODO: Error handling
        }
    }

    const updateTransaction = async (event) => {
        try {
            const {
                title,
                amount,
                category,
                description,
                transactionType,
                date
            } = event.data;

            const id = event.data._id;
            const apiUrl = `${updateTransactionApi}/${id}`;

            console.log(apiUrl);

            const response = await axios.put(apiUrl,
                {
                    title: title,
                    amount: amount,
                    category: category,
                    description: description,
                    transactionType: transactionType,
                    date: date,
                }
            );

            console.log(response);

        } catch (error) {
            // TODO: Error handling
        }
    }

    const deleteTransaction = async (event) => {
        try {
            const id = event.data._id;
            const userId = currentUser.id;
            const params = {
                id: id,
                userId: userId
            };

            const apiUrl = `${deteleTransactionApi}/${id}/${userId}`;

            const response = await axios.delete(apiUrl, { params });
        } catch (error) {
            // TODO: error handling
        }
    }

    if (redirect) {
        return <Navigate to="/register" />
    }

    return (
        <Box
            sx={{
                width: "80%",
                p: "20px",
                display: "block",
                margin: "10px auto",
            }}
        >
            <DataGrid
                dataSource={transactions}
                keyExpr="_id"
                showBorders={true}
                allowColumnResizing
                repaintChangesOnly={true}
                // onEditingStart={updateCurrKey()}
                onRowInserted={(e) => addTransaction(e)}
                onRowUpdated={(e) => updateTransaction(e)}
                onRowRemoved={(e) => deleteTransaction(e)}
                onSaved={fetchTransaction}
            >
                <Paging enabled={true} pageSize={10} />
                <Editing
                    refreshMode="full"
                    mode="popup"
                    useIcons={true}
                    allowAdding={true}
                    allowUpdating={true}
                    allowDeleting={true}
                >
                    <Popup
                        title="Transaction Information"
                        showTitle
                        width={"60%"}
                        height={"60%"}
                    />
                    <Form>
                        <Item itemType="group" colCount={2} colSpan={2}>
                            <Item dataField="title" isRequired />
                            <Item dataField="transactionType" isRequired />
                            <Item dataField="amount" isRequired />
                            <Item dataField="date" isRequired />
                            <Item dataField="category" isRequired />
                            <Item
                                dataField="description"
                                editorType="dxTextArea"
                                colSpan={2}
                                editorOptions={notesEditorOptions}
                                isRequired
                            />
                        </Item>
                    </Form>
                </Editing>
                <Column dataField="date" dataType="date" />
                <Column dataField="title" />
                <Column dataField="amount" dataType="number" alignment="left" />
                <Column dataField="transactionType" datatype="transactionType">
                    <Lookup
                        dataSource={transactionType}
                        valueExpr="type"
                        displayExpr="name"
                    />
                </Column>
                <Column dataField="category" dataType="category">
                    <Lookup
                        dataSource={category}
                        valueExpr="type"
                        displayExpr="name"
                    />
                </Column>
                <Column dataField="description" visible={false} />
            </DataGrid>
        </Box>
    );
};

export default Transactions;
