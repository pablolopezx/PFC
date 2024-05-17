import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div>
            <div className="container">
                <div className="text-center mt-5">
                    <p>La página que estás buscando no existe.</p>
                    <button className="btn btn-primary">
                        <Link className="text-white" to="/">
                            Volver a la página de inicio
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    );

};

export default NotFound;