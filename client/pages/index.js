import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async context => {
  console.log('LANDING PAGE!');
  const client = buildClient(context);
  // console.log('CLIENT is :', client);
  const { data } = await client.get('/api/users/currentuser');
  // console.log('DATA is :', data);
  return data;
};

export default LandingPage;