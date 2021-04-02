import { FC } from 'react';
import TopMeny from './topMenu';
interface layoutProps {

}
const Layout: FC<layoutProps> = ({ children }) => {
    return (
        <>
            <TopMeny></TopMeny>
            {children}
        </>
    )
}
export default Layout;