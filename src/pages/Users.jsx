import Heading from "../ui/Heading";
import UserHeader from "../ui/UserHeader";
import SignupForm from "../features/authentication/SignupForm";

function NewUsers() {
  return (
    <Heading as="h1">
      <UserHeader
        title="Create New User"
        subtitle="Add a new user account to the system with email and password"
      />
      <SignupForm />
    </Heading>
  );
}

export default NewUsers;
