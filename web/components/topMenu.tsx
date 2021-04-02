import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { useRouter } from 'next/router';

import { MeDocument, useLogoutMutation, useMeQuery } from '../generated/graphql';

function getPath(name) {
    switch (name) {
        case 'logout':
        case 'home':
            return '/';
        default:
            return `/${name}`;
    }
}

const topMenu = () => {
    const [activeItem, setState] = useState('home')
    const router = useRouter();
    const { data } = useMeQuery();
    const [logout] = useLogoutMutation()
    console.log(data);
    const handleItemClick = (e, { name }) => {
        if (name === 'logout') {
            logout({ refetchQueries: [{ query: MeDocument }] })
        }
        setState(name);
        router.push(getPath(name));
    }

    return (
        <Menu inverted >
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
            />
            {!data?.me && <>
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                /></>}

            {data?.me && <Menu.Menu position='right'>
                <Menu.Item color="teal" content={`Loged in as ${data?.me?.userName}`} />
                <Menu.Item
                    name='logout'
                    active={activeItem === 'logout'}
                    onClick={handleItemClick}
                />
            </Menu.Menu>}
        </Menu>
    )
}
export default topMenu;