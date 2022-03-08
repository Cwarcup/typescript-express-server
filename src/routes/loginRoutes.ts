import { Router, Request, Response, NextFunction } from 'express';

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined }
};

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if(req.session && req.session.loggedIn) {
    next();
    return;
  }
}

const router = Router();

router.get('/login', (req: Request, res: Response ) => {
  res.send(`
    <form method="POST">
      <div>
        <label>Email</label>
        <input name="email" />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" />
      </div>


      <button type="submit">Submit</button>
    </form>

  `);
});


// login and create a session
router.post('/login', (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;

  if(email && password && email === 'hi@hi.com' && password === 'password') {
    // mark this person as logged in. Need to set a property on the users session,
    req.session = { loggedIn: true };
    // redirect them to the root route
    res.redirect('/')
  } else {
    res.send('Invalid email or password. Try again.')
  }

});

// where directed after user tries to login
router.get('/', (req: Request, res: Response) => {
  if(req.session && req.session.loggedIn) {
    res.send(`
      <div>
        <div>You are logged in</div>
        <a href="/logout">Logout</a>
      </div>
    `)
  } else {
    res.send(`
    <div>
      <div>You are not logged in</div>
      <a href="/login">Login</a>
    </div>
  `)
  }
});

//log out
router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/');

});

router.get('/protected')


export { router };