# Following use cases are assumed NOT in the scope

1. User inputs transaction without following date order.
   (a) New entry needs to refer to past transaction's to check the balance.
   (b) When new entry is in the past, it may affect the current balance by changing the Interest.

   For example:

   ```
   Account: AC001
   | Date | Txn Id | Type | Amount |
   | 20230505 | 20230505-01 | D | 100.00 |
   | 20230601 | 20230601-01 | D | 150.00 |
   // Following entry (20230526-01) needs to check the balance before 20230526, not current balance
   // In addition, 202330530 interest amount will be affected as well
   | 20230526 | 20230526-01 | W | 110.00 |
   ```

2. Balance should be updated when new interest rule is added or when existing interest rule is updated

# Other Assumptions

1. `Input Transactions`: Date should not be future date
2. `Define Interest Rate Rule`:
   (a) Date should not be future date
   (b) When user input more than 2 decimal places for Interest Rate, only keep up to 2 decimal places to be consistent as display
3. `Print Statement`:
   (a) Date should not be future date
   (b) Show error message if input is not in <Account> <Year><Month> format
   (c) Show error message if account doesn't exist
   (d) Assume transaction balances already included interests of previous months though interest transactions are not shown in `Input Transactions` result as it's added by system, not user.
   (e) Show Interest transaction if it's not in the month for demo purpose (It's not added to repository as it shouldn't be the responsibility of print statement). If Interest Rule is added after print statement, interest will NOT be recalculated.

# Prerequisites

Install `Node.js`, `npm`, and `git`

# Installation

1. Open command line tool
2. Clone the GitHub repo: `git clone https://github.com/yingTzuHuang/bank-console-app.git`
3. Go to the folder where you clone the repo: `cd your-local-folder-location`
4. Install dependencies: `npm install`

# Run the Application (continue from command line tool)

`npm run build-and-start`

# Run the Unit Tests (continue from command line tool)

`npm run test`
