import * as React from 'react';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import moment from 'moment';
import fileSize from 'filesize';
import { RCloneFile } from '../../interfaces';
import LoadingContext from '../../contexts/loading';
import './file.less';

type Props = {
    file: RCloneFile;
    isCurrent: boolean;
    setCurrent: Function;
}

const FileRow: React.FunctionComponent<Props> = ({ file, isCurrent, setCurrent }) => {
    const router = useRouter();
    const context = React.useContext(LoadingContext);

    const goTo = React.useCallback(() => {
        if (file.isDir) {
            context.setLoading(true);
            router.push(`/browser/${encodeURIComponent(Buffer.from(file.path).toString('base64'))}`);
        } else {
            window.open(`/api/download/${encodeURIComponent(Buffer.from(file.path).toString('base64'))}`)
        }
    }, [file]);

    return (<Grid
        container
        key={file.name}
        className="file-row"
        data-is-current={isCurrent}
        onClick={() => setCurrent(file.name)}
        onDoubleClick={goTo}
    >
        <Grid item xs={8} className="name">
            {file.isDir ? <FolderIcon /> : <InsertDriveFileIcon />}
            {file.name}
        </Grid>
        <Grid item xs={2}>
            <div className="time">{file.isDir ? '-' : moment(file.time).format('YYYY-MM-DD HH:mm')}</div>
        </Grid>
        <Grid item xs={2}>{file.isDir ? '-' : fileSize(file.size || 0)}</Grid>
    </Grid>)
}

export default FileRow;
