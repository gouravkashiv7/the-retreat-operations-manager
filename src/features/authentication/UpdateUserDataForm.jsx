import { useState } from "react";
import styled from "styled-components";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";
import Avatar from "../../ui/Avatar";

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: {
        fullName: currentFullName,
        role: currentRole,
        avatar: currentAvatar,
      },
    },
  } = useUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);
  const { isLoading, updateUser } = useUpdateUser();

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          e.target.reset();
        },
      },
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Role">
        <Input
          value={currentRole || "guest"}
          disabled
          style={{ textTransform: "capitalize" }}
        />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          disabled={isLoading}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
        />
      </FormRow>
      <FormRow label="Avatar image">
        <AvatarContainer>
          <Avatar src={currentAvatar} fullName={currentFullName} />
          <FileInput
            id="avatar"
            disabled={isLoading}
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </AvatarContainer>
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          $variation="secondary"
          onClick={handleCancel}
          disabled={isLoading}
          style={{ marginRight: "8rem" }}
        >
          Cancel
        </Button>
        <Button disabled={isLoading}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
