import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, ColorPicker } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ManagerGender = () => {


    return (
        <div style={{ borderRadius: '0px', padding: '10px', backgroundColor: '#f7f9fa', width: "100%" }}>
            ManagerGender
        </div>
    );
};

export default ManagerGender;