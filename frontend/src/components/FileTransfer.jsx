import React, { useState, useRef } from "react";
import styled from 'styled-components';


export default function FileTransfer() {

    const fileInputField = useRef(null);
    const [files, setFiles] = useState({}) ;

    return (
        <Container>
            <h1>Mai Roo Dunga</h1>
            <label htmlFor="inputField">
                <input type="file" id="inputField" ref={fileInputField} />
            </label>
        </Container>
    );
}

const Container = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
`;