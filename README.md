# typescript-express-server
 Authentication style app to practice TypeScript and Express.

```
npm init -y

tsc --init

npm install concurrently nodemon
```
```json
"scripts": {
  //...
 "rootDir": "./src",
 "rootDir": "./src", 
 //...
}
```
Run with `npm start`.

Install [body-parser](https://www.npmjs.com/package/body-parser) and [cookie-session](https://www.npmjs.com/package/cookie-session): `npm npm install express body-parser cookie-session`.

Install TypeScript definitions: `npm install @types/express @types/cookie-session @types/body-parser`.

# Basic Routes with Express and TS
```typescript
import express, {Request, Response} from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send(`
  <div>
    <h1>Hi there!</h1>
  </div>
  `);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
```

Express router: [info](http://expressjs.com/en/5x/api.html#router).
Using a router:
```typescript
// new file 'loginRoutes.ts'
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('hi there');
});

export { router };

// index.ts
import express, {Request, Response} from 'express';
import { router } from './routes/loginRoutes'; // import the route

const app = express();

app.use(router) // use the route

// do not need this anymore if we are using a route.
// app.get('/', (req: Request, res: Response) => {
//   res.send(`
//   <div>
//     <h1>Hi there!</h1>
//   </div>
//   `);
// });

app.listen(3000, () => {
  console.log('Listening on port 3000');
})

```
## body-parser setup
```typescript
// index.ts
import express, {Request, Response} from 'express';
import { router } from './routes/loginRoutes';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(router)

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

//loginRoutes.ts
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/login', (req: Request, res: Response ) => {
  res.send(`
    <form method="POST">
      <div>
        <label>Email</label>
        <input type="email" name="email" />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" />
      </div>


      <button type="submit">Submit</button>
    </form>

  `);
});

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body; //remember we named our classes with email and password

  res.send(email + password);
})

export { router };
```

## About Middleware
- are functions that receive the req and res objects.
- they also reference the next middleware to be executed if there is no other middleware.
  - the next function will instead be our request handler
```
(req: Request, res: Response) => {
  const { email, password } = req.body;

  res.send(email + password);
  ```
- goal is to do some processing of the 'Request' and 'Response', then call next function when complete. 
- this is completely counterproductive to what TypeScript is doing. TS doesn't know what properties are being added or removed. 

## Issues with Type Definition Files
CONS:
- Type definition files alone can't express what is going on in the JS world accurately (eg middleware)
- Type definition files provided to us aren't always accurate
- Inputs to a server (or any program with external inputs) are not guarenteed to exist, or be of the correct type
PROS:
- Addressing these type issues with TS can force us to write better code

Solution: Create an interface which extends the property and their expected types.
```typescript
interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined }
};
```

# Prototype Reminder
Remember, classes in ES 2015 and TypeScript do not *really* exist. **classes in JavaScript are 'syntactic sugar' over prototypal inheritance.**



# Decorators

import [ts-express-decorator](https://www.npmjs.com/package/ts-express-decorators)

Decorators are...
- function that can be used to **modify/change properties/methods in the class.**
- not the same as JavaScript decorators.
- used inside/on classes only.
- understanding the order in which decorators are ran.
- experimental.

Decorator [notes: ](https://github.com/Cwarcup/notes/root/typescript/topics/decorators.md#L318)

# A Closer Integration

So for now, we've tried to use express as normally as we could and just added in the absolute bare minimum number of type annotations. So we were only making use of typescript to get some really basic checking and error catching inside of our app. We didn't do any special customization or anything like that. 

Next, we're going to try to figure out how we can really twist express and ts together to make them work together way more closely than they currently are.

Whenever we make use of ts, the main features of the language is classes and interfaces. How do we get express to work with classes? It's a spectrum.

**Continue if getting very into express and ts.**