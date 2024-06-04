import React from "react";
import "./DeliveryAddressCard.modul.scss";

export const DeliveryAddressCard = (props) => {

    return (
        <div className="">
            {props.devaddress?
            <div className="ccd">
                <div className="card-container-deliv">
                    <h3>{props.devaddress.address}</h3>
                    <p>{props.devaddress.name} {props.devaddress.surname}</p>
                    <p>{props.devaddress.phone}</p>
                    <p>{props.devaddress.email}</p>
                    
                </div>
                
            </div>
            :
            <div className=""></div>
            }
        </div>
    )
}