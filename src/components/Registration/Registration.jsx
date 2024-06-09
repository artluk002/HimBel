import React, { useState, useEffect, useContext } from 'react';
import "./Registration.modul.scss";
import { AuthAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';
import { MyContext } from '../MyContext/MyContext';
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
export const Registration = () => {
  const navigate = useNavigate();
  const { registrationToggle } = useContext(MyContext);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill(''));
  const [registrationDate, setRegistrationDate] = useState();
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 80,
        }}
        disabled
      >
        <Option value="375">+375</Option>
      </Select>
    </Form.Item>
  );

  const handleCodeChange = (value, index) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
  };

  const onFinish = async (values) => {
    try {
      setRegistrationDate(values);
      await AuthAPI.sendVerificationEmail(values.email);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  };
  const handleVerification = async () => {
    let response;
    try {
      const code = verificationCode.join('');
      await AuthAPI.verifyCode(code);
      response = await AuthAPI.registrationReq(registrationDate);
      
      form.submit();
      registrationToggle();
      navigate('/success');
    } catch (error) {
      console.error('Verification failed:', error);
      console.log(response);
    }
  };

  return (
    <>
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: '+375',
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item 
        name='name'
        label="Name"
        rules={[
          {
           required: true,
           message: 'Please input your First name',
          },
        ]}>
        <Input />
      </Form.Item>

      <Form.Item 
        name='surname'
        label="Surname"
        rules={[
          {
           required: true,
           message: 'Please input your Last name',
          },
        ]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="login"
        label="Login"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            min: 8,
            message: 'Please input your password!',
            value: '+375'
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
    <Modal
        title="Email Verification"
        visible={isModalVisible}
        onOk={handleVerification}
        onCancel={() => setIsModalVisible(false)}
      >
        <Row gutter={8}>
          {verificationCode.map((_, index) => (
            <Col span={4} key={index}>
              <Input
                maxLength={1}
                value={verificationCode[index]}
                onChange={(e) => handleCodeChange(e.target.value, index)}
              />
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
};  