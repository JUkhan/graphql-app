import React, { useState } from 'react';
import Link from 'next/link';
import { Grid, Form } from 'semantic-ui-react';
import { formatResponse } from '../utils';
import { useRouter } from 'next/router';

import Layout from '../components/layout';
import { MeDocument, useLoginMutation } from '../generated/graphql';
interface loginProps {

}

interface User {
    id: string;
    fullName: string;
    email: string
}

const Login: React.FC<loginProps> = () => {
    const [state, setState] = useState({ userName: '', password: '' });
    const [register, { loading }] = useLoginMutation()
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    function handleChange(e, { name, value }) {
        setState(obj => ({ ...obj, [name]: value } as any))
    }

    async function handleSubmit() {
        const res = await register({
            variables: state,
            refetchQueries: [{ query: MeDocument }]
        });
        const data = formatResponse<User>(res as any, 'login', 'user');
        if (data.errors) {
            setErrors(data.errors);
        }
        else {
            setState({ userName: '', password: '' });
            router.push('/');
        }

    }
    const { userName, password } = state;
    return (
        <Layout>
            <Grid doubling container centered >

                <Grid.Column mobile="16" computer="8">
                    <Form loading={loading} onSubmit={handleSubmit}>

                        <Form.Input required
                            placeholder='User Name/Email'
                            error={!errors.userName ? false : {
                                content: errors.userName, pointing: 'below'
                            }}
                            name='userName'
                            value={userName}
                            onChange={handleChange}
                        />

                        <Form.Input required
                            placeholder='Password'
                            error={!errors.password ? false : {
                                content: errors.password, pointing: 'below'
                            }}
                            name='password'
                            value={password}
                            onChange={handleChange}
                        />
                        <Link href="/forgotPassword">
                            <a>Forgot Password</a>
                        </Link>
                        <Form.Button color="teal" content='Login' />

                    </Form>
                </Grid.Column>



            </Grid>
        </Layout>
    )
}


export default Login;