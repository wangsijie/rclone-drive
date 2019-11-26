import { NextPage } from "next";
import { useRef, useState } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Layout from "../components/Layout";
import { post } from '../utils/api';

const LoginPage: NextPage = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<boolean>(false);

    const login = async () => {
        const value = inputRef.current!.value;
        try {
            setError(false);
            await post('/api/login', { password: value });
            window.location.href='/';
        } catch (e) {
            console.log(e);
            setError(true);
        }
    }

    return <Layout>
        <Paper style={{ margin: '100px auto', width: '350px', padding: '40px' }}>
            <TextField
                label="Enter password"
                type="password"
                fullWidth
                name="password"
                inputRef={inputRef}
            />
            <p>
                <Button variant="contained" color="primary" onClick={login}>Login</Button>
                {error && <span style={{ color: 'red', marginLeft: '10px' }}>Login failed!</span>}
            </p>
        </Paper>
    </Layout>
}

export default LoginPage;
