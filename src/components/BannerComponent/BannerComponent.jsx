import React from "react";
import InputComponent from "../InputComponent/InputComponent";
import bannerImage from "../../assets/banner_nobackground.png";
import { Grid } from "antd";
const BannerComponent = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    return (
        <div
            style={{
                backgroundColor: "#1890ff",
                position: "relative",
                minHeight: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: "20px",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${bannerImage})`,

                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right",
                    opacity: 0.7,
                }}
            >

            </div>
            <h1 style={{ color: "white", fontWeight: "bolder" }}>
                Chào mừng bạn đến với MediCare
            </h1>
            <p
                style={{
                    color: "white",
                    fontSize: "16px",

                }}
            >
                Đặt khám với hơn 1000 bác sĩ, 25 bệnh viện, 100 phòng khám trên
                MediCare để có số thứ tự và khung giờ khám trước.
            </p>
            <InputComponent
                placeholder="Tìm kiếm bác sĩ, phòng khám, bệnh viện"
                onSearch={(value) => console.log(value)}
                size="large"
            />
        </div>
    );
};

export default BannerComponent;
