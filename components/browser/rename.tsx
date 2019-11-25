import * as React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// import { fetchWrapper } from '../../utils/api'
import './index.less';

type Props = {
    path: string;
}

const Rename: React.FunctionComponent<Props> = ({ path }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleClick = React.useCallback(() => {
        console.log(path);
        setOpen(true);
    }, [path])
    const handleClose = () => setOpen(false);
    const handleSubmit = async () => {
        if (inputRef.current) {
            const value = inputRef.current.value;
            if (value) {
                // await fetchWrapper(
                //     '/api/browser/rename',
                //     {
                //         body: JSON.stringify({
                //             path,
                //             name: value,
                //         }),
                //         method: 'POST',
                //     },
                // );
            }
        }
    }
    return (<>
        <Button variant="contained" startIcon={<EditIcon />} onClick={handleClick}>Rename</Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Rename</DialogTitle>
            <DialogContent style={{ width: '300px' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="New Name"
                    type="text"
                    fullWidth
                    inputRef={inputRef}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Rename
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default Rename;
