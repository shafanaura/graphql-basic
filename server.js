const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const forumData = [
	{
		id: "1",
		title: "Invisible Man",
		desc: "Thriller",
		userId: "1",
	},
	{
		id: "2",
		title: "Avangers",
		desc: "Action",
		userId: "2",
	},
	{
		id: "3",
		title: "Ouija",
		desc: "Horror",
		userId: "2",
	},
];

const userData = [
	{
		id: "1",
		name: "Shafa",
	},
	{
		id: "2",
		name: "Audi",
	},
	{
		id: "3",
		name: "Yasir",
	},
];

const schema = buildSchema(`
  type Forum {
    id: ID,
    title: String,
    desc: String,
    user:User
  }

  type User{
    id: ID,
    name:String,
    forums:[Forum]
  }

	type Query {
    forum(id:ID!):Forum,
		forums:[Forum],
    user(id:ID!):User,
		users:[User],
  }
  
  type Mutation {
    addUser(id: ID, name: String) : User,
    addForum(id: ID, title: String, desc: String, userId: String) : Forum
  }
`);

const resolvers = {
	forum: (args) => {
		//data user -> userId?
		let _forum = forumData.find((el) => el.id == args.id);
		_forum["user"] = userData.find((el) => el.id == _forum.id);

		return _forum;
	},
	forums: () => {
		let _user = "";

		//loop forum dan masukkan data user
		forumData.map((eachForum) => {
			_user = userData.find((el) => el.id == eachForum.userId);
			eachForum["user"] = _user;
		});

		return forumData;
	},

	user: (args) => {
		let _user = userData.find((el) => el.id == args.id);
		let _forums = forumData.filter((el) => el.userId == _user.id);
		_user["forums"] = _forums;

		return _user;
	},

	users: () => {
		let _forums = "";

		//loop user dan masukkan semua data forum
		userData.map((eachUser) => {
			_forums = forumData.filter((el) => el.userId == eachUser.id);
			eachUser["forums"] = _forums;
		});

		return userData;
	},

	//Menambahkan data
	addUser: ({ id, name }) => {
		let _newUser = { id: id, name: name };
		userData.push(_newUser);

		return _newUser;
	},

	addForum: ({ id, title, desc, userId }) => {
		let _newForum = { id: id, title: title, desc: desc, userId: userId };
		forumData.push(_newForum);
		console.log(forumData);
		return _newForum;
	},
};

const app = express();
app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		rootValue: resolvers,
		graphiql: true,
	}),
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
