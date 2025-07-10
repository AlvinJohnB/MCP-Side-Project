# MCP Side Project - Group 2

# Technical Specifications Document

## 1. Title Page

- **Project Name**: Airline Booking System Prototype (Front-End)
- **Version**: Prototype v.1
- **Date**: June 24, 2025
- **Author(s)**: Bootcamp Group 2 -

## 2. Table of Contents

1. [Introduction](#3-introduction)
2. [Overall Description](#4-overall-description)
3. [Visual Mockup Reference](#5-visual-mockup-reference)
4. [Features](#6-features)
5. [Functional Requirements](#7-functional-requirements)
6. [Non-Functional Requirements](#8-non-functional-requirements)
7. [Data Requirements](#9-data-requirements)
8. [External Interface Requirements](#10-external-interface-requirements)
9. [Glossary](#11-glossary)
10. [Appendices](#12-appendices)

## 3. Introduction

- **Purpose**: To develop a prototype Airline Booking web-application that allows users to browse flights, search tour packages, book flights, and make payments.
- **Scope**: The application will include user registration, product catalog, shopping cart, checkout process, and integration with a payment gateway. It will not include advanced features such as user reviews or order tracking.
- **References**: None

## 4. Overall Description

- **Product Perspective**: The application is a standalone web app for travel agencies to upsell fight promos online.
- **Product Functions**:
  - User registration and login
  - Product browsing and search
  - Booking management
  - Checkout process
  - Payment processing
- **Operating Environment**:
  - **Client**: Modern web browsers (Chrome, Firefox, Safari)

## 5. Visual Mockup Reference

- **Link or Screenshot**: ![Mockup](mockup_link.png)

## 6. Features

- **User Registration and Login**: Users can create accounts and log in.
- **Product Catalog**: Users can browse products by categories.
- **Search Functionality**: Users can search for products.
- **Shopping Cart**: Users can add, remove, and update products in their cart.
- **Checkout Process**: Users can enter shipping information and review their order.
- **Payment Gateway Integration**: Users can make payments securely using a payment gateway.

## 7. Functional Requirements

### Use Cases

- **Use Case 1**: User Registration
  - **Title**: Register a new user
  - **Description**: Users can create an account with an email and password.
  - **Actors**: End User
  - **Preconditions**: User is on the registration page.
  - **Postconditions**: User account is created and user is logged in.
  - **Main Flow**: User enters email and password > User clicks "Register" > System creates account and logs in user.
  - **Alternate Flows**: User enters invalid email > System shows error.

### System Features

- **Feature 1**: User Registration and Login
  - **Description**: Allow users to register and log in.
  - **Priority**: High
  - **Inputs**: Email, password
  - **Processing**: Validate input, create user account
  - **Outputs**: User is logged in
  - **Error Handling**: Show error messages for invalid input

## 10. External Interface Requirements

- **User Interfaces**:

  - Registration/Login page
  - Product Catalog page
  - Product Detail page
  - Shopping Cart page
  - Checkout page

- **Supporting Information**:
  - User flow diagrams
  - Wireframes
- **Revision History**:
  - **v1.0**: Initial version - June 24, 2024
