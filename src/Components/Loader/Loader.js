
import React from "react";
import "..//Loader/Loader.css";
import { CircularProgress } from "@mui/material";
const Loader =() =>{

    return(
        <div className="loading">
            <CircularProgress />
        </div>
    )
}

export default Loader;