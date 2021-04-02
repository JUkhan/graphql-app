
import { useState } from 'react';
import { Grid, Form, Header } from 'semantic-ui-react';
import { useEmailVarificationMutation } from '../generated/graphql';



const ForgotPassword = () => {
    const [state, setState] = useState({ email: '' });
    const [varification, { loading, data }] = useEmailVarificationMutation()

    const { email } = state;
    function handleChange(e, { name, value }) {
        setState(obj => ({ ...obj, [name]: value } as any))
    }
    async function handleSubmit() {

        varification({ variables: { email } });

    }
    const isOK = data?.changePasswordEmailVarification ?? false;
    console.log(data);
    return (
        <Grid doubling container centered >
            {isOK && <Grid.Column>
                <Header
                    textAlign="center"
                    color="red"
                    content="Please confirm password change process from your email"

                />
            </Grid.Column>}
            {!isOK && <Grid.Column mobile="16" computer="8">
                <Form loading={loading} onSubmit={handleSubmit}>

                    <Form.Input required
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={handleChange}
                    />


                    <Form.Button color="teal" content='Change Password' />

                </Form>
            </Grid.Column>}



        </Grid>
    )
}

export default ForgotPassword;