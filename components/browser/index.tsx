import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Layout from '../Layout';
import { RCloneFile } from '../../interfaces';
import Nav from './nav';
import Rename from './rename';
import NewFolder from './new-folder';
import UploadButton from './upload';
import DeleteButton from './delete';
import FileRow from './file';
import './index.less';

type Props = {
    files: RCloneFile[];
    path?: string;
    notFound?: boolean;
}

const Browser: React.FunctionComponent<Props> = ({ files, path = '/', notFound }) => {
    const [current, setCurrent] = React.useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = React.useState<RCloneFile[]>([]);
    const [deletedNames, setDeletedNames] = React.useState<string[]>([]);

    const allFiles = React.useMemo(() => {
        const result = [
            ...files.filter(file => file.isDir),
            ...uploadedFiles,
            ...files.filter(file => !file.isDir),
        ];
        // remove duplicated files
        const names: string[] = result.map(file => file.name);
        return result.filter((file, index) => {
            return names.indexOf(file.name) === index;
        }).filter(file => !deletedNames.includes(file.name));
    }, [files, uploadedFiles, deletedNames]);

    const currentFile = React.useMemo(() => {
        if (current === null) {
            return null;
        }
        const file = allFiles.find(f => f.name === current);
        return file;
    }, [current, allFiles]);

    const currentName = currentFile && currentFile.name;

    const onUploaded = React.useCallback((file) => {
        setCurrent(null);
        setDeletedNames(prevNames => prevNames.filter(f => f !== file.name));
        setUploadedFiles(prevFiles => [file, ...prevFiles]);
    }, [setUploadedFiles, setCurrent, setDeletedNames]);

    const onDeleted = React.useCallback((name) => {
        setCurrent(null);
        setDeletedNames(prevNames => [...prevNames, name]);
    }, [setDeletedNames, setCurrent]);

    if (notFound) {
        return <Layout className="ui-browser error">
            <div>Can't find path: {path}</div>
            <Button href="/browser">Back to home</Button>
        </Layout>
    }

    return (
        <Layout className="ui-browser">
            <Nav path={path} />
            <UploadButton path={path} onUploaded={onUploaded} />
            {' '}
            <NewFolder path={path} />
            {currentFile !== null && <>
                {' '}
                <Rename path={currentName} />
                {' '}
                <DeleteButton path={path} name={currentName} isDir={currentFile.isDir} onDeleted={onDeleted} />
            </>}
            <div className="browser-table">
                <Grid container className="header-row">
                    <Grid item xs={8}>Name</Grid>
                    <Grid item xs={2}>Last Modified</Grid>
                    <Grid item xs={2}>Size</Grid>
                </Grid>
                {allFiles.map(file => <FileRow
                    key={file.name}
                    isCurrent={file.name === currentName}
                    setCurrent={setCurrent}
                    file={file}
                />)}
            </div>
        </Layout>
    )
}

export default Browser;
