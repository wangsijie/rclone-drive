import * as React from 'react';
import { useRouter } from 'next/router'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// import { fetchWrapper } from '../../utils/api'
import './index.less';
import LoadingContext from '../../contexts/loading';
import { post } from '../../utils/api';

type Props = {
    path: string;
}

const NewFolder: React.FunctionComponent<Props> = ({ path }) => {
    const { setLoading } = React.useContext(LoadingContext);
    const [open, setOpen] = React.useState<boolean>(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const router = useRouter();
    const handleClick = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSubmit = async () => {
        if (inputRef.current) {
            const value = inputRef.current.value;
            if (value && value.length) {
                setLoading(true);
                await post('/api/browser/mkdir', { path: `${path}${value}` });
                router.push(`/browser/${encodeURIComponent(Buffer.from(`${path}${value}`).toString('base64'))}`);
            }
        }
    }
    return (<>
        <Button variant="contained" startIcon={<CreateNewFolderIcon />} onClick={handleClick}>New Folder</Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create New Folder</DialogTitle>
            <DialogContent style={{ width: '300px' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Folder Name"
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
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default NewFolder;
