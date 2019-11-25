import * as React from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import Upload from 'rc-upload';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { upload } from '../../utils/api';
import { RCloneFile } from '../../interfaces';
import LoadingContext from '../../contexts/loading';
import './index.less';

type Props = {
    path: string;
    onUploaded: Function;
}

const UploadButton: React.FunctionComponent<Props> = ({ path, onUploaded }) => {
    const [message, setMessage] = React.useState<string | null>(null);
    const context = React.useContext(LoadingContext);

    const beforeUpload = (f: any) => {
        context.setLoading(true);
        upload(`/api/browser/rcat?path=${encodeURIComponent(Buffer.from(path).toString('base64'))}`, { file: f })
            .then((uploadedFile: RCloneFile) => {
                context.setLoading(false);
                setMessage(`Uploaded: ${uploadedFile.name}`);
                onUploaded(uploadedFile)
            });
        return false;
    }

    return (<>
        <Upload
            beforeUpload={beforeUpload}
        >
            <Button color="primary" variant="contained" startIcon={<CloudUploadIcon />}>Upload</Button>
        </Upload>
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={!!message}
            onClose={() => setMessage(null)}
            message={message}
            autoHideDuration={6000}
            action={[
                <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  onClick={() => setMessage(null)}
                >
                  <CloseIcon />
                </IconButton>,
            ]}
        />
    </>)
}

export default UploadButton;
