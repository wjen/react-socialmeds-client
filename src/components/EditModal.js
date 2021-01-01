import React, { useState, useContext } from 'react';
import {
  Button,
  Header,
  Popup,
  Icon,
  Image,
  Modal,
  Form,
} from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function EditModal({ username, postId, body }) {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const { values, onChange, onSubmit } = useForm(editPostCallback, {
    body: body,
  });

  const [editPost, { error }] = useMutation(EDIT_POST_MUTATION, {
    update(proxy, result) {
      console.log(result);
      console.log('hi');
    },
    variables: {
      postId,
      body: values.body,
    },
    onError(error) {
      console.log(error);
    },
  });

  function editPostCallback() {
    setOpen(false);
    editPost();
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button as="div" color="instagram" floated="right">
          <Icon name="edit outline" style={{ margin: 0 }} />
        </Button>
      }
    >
      <Modal.Header>{username}</Modal.Header>
      <Modal.Content image>
        <Image
          size="small"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
          wrapped
        />
        <Modal.Description style={{ width: '100%' }}>
          <Header>Edit Post</Header>
          <Form onSubmit={onSubmit}>
            <Form.Field>
              <Form.Input
                name="body"
                onChange={onChange}
                value={values.body}
                error={errors && errors.general}
              />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Update Post"
          labelPosition="right"
          icon="checkmark"
          onClick={onSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

const EDIT_POST_MUTATION = gql`
  mutation editPost($postId: ID!, $body: String!) {
    editPost(postId: $postId, body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default EditModal;
