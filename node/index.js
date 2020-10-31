
require( "dotenv" ).config();
const _ = require( "lodash" );
const sgMail = require( "@sendgrid/mail" );

sgMail.setApiKey( process.env.SENDGRID_KEY );

const express = require( "express" );
const cors = require( "cors" );
const bodyParser = require( "body-parser" );

const app = express();

// const whitelist = [ /localhost/, /www\.adultletics\.com\.au/ ];
// const corsOptionsDelegate = ( req, callback ) => {
// 	let corsOptions;
// 	whitelist.forEach( e => {
// 		if ( req.header( "Origin" ).match( e ) !== -1 ) {
// 			corsOptions = { origin: true };
// 		} else {
// 			corsOptions = { origin: false };
// 		}
// 	});
// 	callback( null, corsOptions );
// };
// app.use( cors( corsOptionsDelegate ))

app.use( cors({ origin: "https://www.adultletics.com.au" }));
app.use( bodyParser.json());

app.post( "/contact", async ( req, res ) => {
	try {
		const body = _.get( req, "body" );
		await sendContactMeEmail( body );

		return res.status( 200 );
	}
	catch ( error ) {
		console.error( error );
		return res.status( 500 ).send({ error });
	}
});

const port = process.env.PORT || 8080;
app.listen( port, () => console.log( "Listening on port", port ));

const sendContactMeEmail = async ({ email, name, message }) => {
	const msg = {
		to: "kate.hobbs4@gmail.com",
		cc: email,
		from: {
			email: "no-reply@adultletics.com.au",
			name: "Kate Hobbs Coaching",
		},
		subject: `Message from ${ name }`,
		content: [{
			type: "text/plain",
			value: `Message:\n\n${ message }`,
		}],
	};
	// ref https://sendgrid.com/docs/API_Reference/api_v3.html

	try {
		await sgMail.send( msg );
	}
	catch ( error ) {
		console.error( error );
		if ( error.response ) console.error( error.response.body );
	}
};
