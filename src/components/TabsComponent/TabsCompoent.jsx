import React from "react";
import { CustomTabs } from "./style";
const TabsCompoent = ({ items, onChange, ...rests }) => {
    return <CustomTabs items={items} onChange={onChange} centered {...rests} />;
};

export default TabsCompoent;
