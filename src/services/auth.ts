export const checkLogin = (req: any) => req.session.user;

export const login = (req: any) => new Promise((resolve, reject) => req.session.regenerate((err: Error) => {
    if (err) {
        reject(err);
    }
    req.session.user = 'default';
    resolve();
}));
