import React, { useState } from 'react';
import { Grid, Form } from 'semantic-ui-react';

import { formatResponse } from '../utils';
import { useRouter } from 'next/router';


import Layout from '../components/layout';
import { RegisterInput, User, useRegisterMutation } from '../generated/graphql';
interface registerProps {

}
interface registerState {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
}



const Register: React.FC<registerProps> = () => {
    const [state, setState] = useState<RegisterInput>({ firstName: '', lastName: '', email: '', userName: '', password: '' });
    const [register, { loading, error, data }] = useRegisterMutation()
    const [errors, setErrors] = useState<Record<string, string>>({});
    const rouser = useRouter();

    function handleChange(e, { name, value }) {
        setState(obj => ({ ...obj, [name]: value } as any))
    }
    if (error) {
        console.log(error);
    }
    console.log(data);
    async function handleSubmit() {
        const res = await register({ variables: { input: state } });

        const data = formatResponse<User>(res as any, 'registerUser', 'user');
        if (data.errors) {
            setErrors(data.errors);
        }
        else {
            setState({ firstName: '', lastName: '', email: '', userName: '', password: '' });
            rouser.push('/');
        }

    }
    const { firstName, lastName, email, userName, password } = state;
    return (
        <Layout>
            <Grid doubling container centered >

                <Grid.Column mobile="16" computer="8">
                    <Form loading={loading} onSubmit={handleSubmit}>

                        <Form.Input required
                            placeholder='First Name'
                            error={!errors.firstName ? false : {
                                content: errors.firstName, pointing: 'below'
                            }}
                            name='firstName'
                            value={firstName}
                            onChange={handleChange}
                        />
                        <Form.Input required
                            placeholder='Last Name'
                            error={!errors.lastName ? false : {
                                content: errors.lastName, pointing: 'below'
                            }}
                            name='lastName'
                            value={lastName}
                            onChange={handleChange}
                        />

                        <Form.Input required
                            placeholder='Email'
                            error={!errors.email ? false : {
                                content: errors.email, pointing: 'below'
                            }}
                            name='email'
                            value={email}
                            onChange={handleChange}
                        />
                        <Form.Input required
                            placeholder='User Name'
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
                        <Form.Button color="teal" content='Register' />

                    </Form>
                </Grid.Column>



            </Grid>
        </Layout>
    )
}


export default Register;