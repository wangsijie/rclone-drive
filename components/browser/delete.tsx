import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import systemPath from 'path';
import { post } from '../../utils/api';
import './index.less';
import LoadingContext from '../../contexts/loading';

type Props = {
    path: string;
    name: string;
    isDir: boolean;
    onDeleted: Function;
}

const DeleteButton: React.FunctionComponent<Props> = ({ path, name, isDir, onDeleted }) => {
    const { setLoading } = React.useContext(LoadingContext);
    const [open, setOpen] = React.useState<boolean>(false);
    const handleClick = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSubmit = async () => {
        setLoading(true);
        await post('/api/browser/rm', { path: systemPath.join(path, name), isDir });
        setLoading(false);
        onDeleted(name);
    }
    return (<>
        <Button variant="contained" startIcon={<DeleteIcon />} onClick={handleClick} color="secondary">Delete</Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Delete</DialogTitle>
            <DialogContent style={{ width: '300px' }}>
                <DialogContentText>
                    Are you sure to delete <strong>{name}</strong>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default DeleteButton;
