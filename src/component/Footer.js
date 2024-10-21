import React from "react";

const Footer = () => {
    return (
        <>
            {/* Footer Field */}
            <footer style={{
                borderTop: "1px solid #444",
                background: "#1f1f1f",
                padding: "20px",
                color: "#e0e0e0",
                textAlign: "center",
                fontSize: "14px"
            }}>
                <p style={{ margin: "0" }}>
                    <a style={{ color: "#31D2F2", textDecoration: "none", fontWeight: "bold", marginLeft: "5px" }}> Social World -  </a>
                    <a style={{ color: "#31D2F2", textDecoration: "none", fontWeight: "bold", marginLeft: "5px" }}> Connect, Share, and Thrive: Where Social Worlds Come Together  </a>
                </p>
            </footer>
        </>
    )
}

export default Footer;