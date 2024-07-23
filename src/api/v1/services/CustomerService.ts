import { Customer, CustomerDoc, DeliveryUser, Food, Vendor } from '../models';
import express, { Request, Response, NextFunction } from 'express';

import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOTP,
  ValidatePassword,
} from '../utils';

import { CreateCustomerInput, UserLoginInput } from '../dto';

export const CreateCustomer = async (input: CreateCustomerInput): Promise<CustomerDoc> => {
  const { email, password, phone } = input;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const customer = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    firstName: '',
    lastName: '',
    address: '',
    verified: true,
    lat: 0,
    lng: 0,
    orders: [],
  });

  return customer;
};

export const CheckCustomerExists = async (input: CreateCustomerInput) => {
  const { email } = input;

  const customerExists = await Customer.exists({ email });

  return customerExists;
};

export const GetCustomerWithEmail = async (input: UserLoginInput): Promise<CustomerDoc> => {
  const { email } = input;

  const customer = await Customer.findOne({ email: email });

  return customer;
};
