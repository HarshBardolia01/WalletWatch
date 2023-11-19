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
import { Box } from "@mui/material";
import category from "../Transaction-Data/category";
import transactionType from "../Transaction-Data/transactionType";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {
    createTransactionApi,
    getTransactionsApi,
    updateTransactionApi,
    deleteTransactionApi,
} from "../utils/ApiRequests.js";
import Header from "../Components/Header.js";

const notesEditorOptions = { height: 100 };

const Transactions = () => {
    const [redirect, updateRedirect] = useState(false);
    const [transactions, updateTransactions] = useState([]);
    // eslint-disable-next-line
    const [frequency, updateFrequency] = useState("custom");
    // eslint-disable-next-line
    const [type, updateType] = useState("all");
    // eslint-disable-next-line
    const [startDate, updateStartDate] = useState(null);
    // eslint-disable-next-line
    const [endDate, updateEndDate] = useState(null);
    const [currentUser, updateCurrentUser] = useState(null);

    const fetchTransaction = () => {
        console.log(currentUser);
        try {
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({
                    userId: currentUser.id,
                    frequency: frequency,
                    startDate: startDate,
                    endDate: endDate,
                    transactionType: type,
                }),
            };
            return fetch(getTransactionsApi, requestOptions)
                .then((res) => res.json())
                .then((d) => console.log(d));
            // const response = axios.post(getTransactionsApi, {
            //     userId: currentUser.id,
            //     frequency: frequency,
            //     startDate: startDate,
            //     endDate: endDate,
            //     transactionType: type,
            // });
            // console.log(response.data.transactions);
            // updateTransactions(data.transactions);
        } catch (error) {
            console.log(error.message);
        }
    };

    const addTransaction = async (event) => {
        try {
            const {
                title,
                amount,
                category,
                description,
                transactionType,
                date,
            } = event.data;

            const response = await axios.post(createTransactionApi, {
                title: title,
                amount: amount,
                category: category,
                description: description,
                transactionType: transactionType,
                date: date,
                userId: currentUser.id,
            });

            if (response.data.success) {
                //
                fetchTransaction();
            } else {
                // error
            }
        } catch (error) {
            // TODO: Error handling
        }
    };

    const updateTransaction = async (event) => {
        try {
            const {
                title,
                amount,
                category,
                description,
                transactionType,
                date,
            } = event.data;

            const id = event.data._id;
            const apiUrl = `${updateTransactionApi}/${id}`;

            console.log(apiUrl);

            const response = await axios.put(apiUrl, {
                title: title,
                amount: amount,
                category: category,
                description: description,
                transactionType: transactionType,
                date: date,
            });

            console.log(response);

            if (response.data.success) {
                //
                fetchTransaction();
            } else {
                // error
            }
        } catch (error) {
            // TODO: Error handling
        }
    };

    const deleteTransaction = async (event) => {
        try {
            const transactionId = event.data._id;
            const userId = currentUser.id;
            const apiUrl = `${deleteTransactionApi}/${transactionId}/${userId}`;

            const response = await axios.delete(apiUrl);
            console.log(response);

            if (response.data.success) {
                //
                fetchTransaction();
            } else {
                // error
            }
        } catch (error) {
            // TODO: error handling
        }
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            updateRedirect(true);
        } else {
            const obj = JSON.parse(user);
            updateCurrentUser(obj);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchTransaction();
        }
    }, [currentUser]);

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Header currentUser />
            <Box
                sx={{
                    width: "90%",
                    p: "20px",
                    display: "block",
                    margin: "10px auto",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        color: "rgb(4, 74, 160)",
                        fontFamily: "sans-serif",
                    }}
                >
                    Welcome {currentUser?.name}!
                </h2>
                <DataGrid
                    dataSource={transactions}
                    keyExpr="_id"
                    showBorders={true}
                    allowColumnResizing
                    repaintChangesOnly={true}
                    onRowInserted={(e) => addTransaction(e)}
                    onRowUpdated={(e) => updateTransaction(e)}
                    onRowRemoved={(e) => deleteTransaction(e)}
                    // onSaved={fetchTransaction}
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
                    <Column
                        dataField="amount"
                        dataType="number"
                        alignment="left"
                    />
                    <Column
                        dataField="transactionType"
                        datatype="transactionType"
                    >
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
        </>
    );
};

export default Transactions;
