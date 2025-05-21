
import FormLogin from "../../components/FormLogin/FormLogin";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
const AuthenticationPage = () => {
    return (
        <DefaultLayout>
            <div
                style={{
                    backgroundColor: "#e5e7eb",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",

                }}
            >
                <img src="mylogo.webp" alt="" width={400} />
                <FormLogin />
            </div>
        </DefaultLayout>
    );
};

export default AuthenticationPage;
