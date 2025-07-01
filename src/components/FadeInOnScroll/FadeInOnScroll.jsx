// components/FadeInOnScroll.jsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FadeInOnScroll = ({ children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // chỉ kích hoạt một lần khi phần tử xuất hiện
        threshold: 0.2,     // phần trăm phần tử hiển thị thì sẽ kích hoạt
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default FadeInOnScroll;
