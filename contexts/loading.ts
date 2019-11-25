import React from 'react';

export interface ILoadingContext {
    loading: boolean;
    setLoading?: Function;
}

const LoadingContext = React.createContext<ILoadingContext>({
    loading: false,
});

export default LoadingContext;
