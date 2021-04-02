import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Grid, Form, Header } from 'semantic-ui-react';
import { useChangePasswordMutation, useValidateTokenQuery } from '../../generated/graphql';


const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [state, setState] = useState({ password: '', cpassword: '' });
    const [changePassword, { loading: changingPassword }] = useChangePasswordMutation()
    const [expired, setExpire] = useState(false);
    const router = useRouter();
    const { password, cpassword } = state;
    function handleChange(e, { name, value }) {
        setState(obj => ({ ...obj, [name]: value } as any))
    }
    async function handleSubmit() {
        if (password !== cpassword) {
            alert("password and confirm password are not equal");
            return
        }

        const res = await changePassword({ variables: { token, password } });
        if (res.data.changePassword) {
            router.push('/passwordChanged');
        }
        else setExpire(true)
    }
    if (expired) {
        return <Header
            textAlign="center"
            color="red"
            content="Your password change token has been expired. Please try again"

        />
    }

    return (
        <Grid doubling container centered >

            <Grid.Column mobile="16" computer="8">
                <Form loading={changingPassword} onSubmit={handleSubmit}>

                    <Form.Input required
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={handleChange}
                    />

                    <Form.Input required
                        placeholder='Confirm Password'
                        name='cpassword'
                        value={cpassword}
                        onChange={handleChange}
                    />
                    <Form.Button color="teal" content='Change Password' />

                </Form>
            </Grid.Column>



        </Grid>
    )
}
ChangePassword.getInitialProps = ({ query }) => {
    return { token: query.token as string }
}
export default ChangePassword;