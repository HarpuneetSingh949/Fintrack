import React ,{useState, useEffect}from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query, deleteDoc,doc} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../components/TransactionsTable";
import NoTransactions from "../components/NoTransactions";
function Dashboard(){
    const [transactions,setTransactions]= useState([]);
    const [loading,setLoading]= useState(false);
    const [user] = useAuthState(auth);
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
    const [income,setIncome]=useState(0);
    const [expense,setExpense]=useState(0);
    const [totalBalance,setTotalBalance]=useState(0);
    const showExpenseModal = () => {
        setIsExpenseModalVisible(true);
    };
    const showIncomeModal = () => {
        setIsIncomeModalVisible(true);
    };
    const handleExpenseCancel = () => {
        setIsExpenseModalVisible(false);
    };
    
    const handleIncomeCancel = () => {
        setIsIncomeModalVisible(false);
    };
      const onFinish = (values, type) => {
        const newTransaction = {
          type: type,
          date: values.date.format("YYYY-MM-DD"),
          amount: parseFloat(values.amount),
          tag: values.tag,
          name: values.name,
        };
        addTransaction(newTransaction);
      };
      async function addTransaction(transaction, many) {
        try {
          const docRef = await addDoc(
            collection(db, `users/${user.uid}/transactions`),
            transaction
          );
          console.log("Document written with ID: ", docRef.id);
           if(!many){
            toast.success("Transaction Added!");
           } 
          let newArr=transactions;
          newArr.push(transaction);
          setTransactions(newArr);
          calculateBalance();
        } catch (e) {
          console.error("Error adding document: ", e);
          toast.error("Couldn't add transaction");
          
        }
      }    
      useEffect(() => {
        fetchTransactions();
      }, [user]);
      useEffect(() => {
        calculateBalance();
      }, [transactions]);

      async function fetchTransactions() {
        setLoading(true);
        if (user) {
          const q = query(collection(db, `users/${user.uid}/transactions`));
          const querySnapshot = await getDocs(q);
          let transactionsArray = [];
          querySnapshot.forEach((doc) => {
            transactionsArray.push(doc.data());
          });
          setTransactions(transactionsArray);
          toast.success("Transactions Fetched");
        }else{
            setTransactions([]);
        }
        setLoading(false);
      }
      const calculateBalance = () => {
        let incomeTotal = 0;
        let expensesTotal = 0;
    
        transactions.forEach((transaction) => {
          if (transaction.type === "income") {
            incomeTotal += transaction.amount;
          } else {
            expensesTotal += transaction.amount;
          }
        });
        setIncome(incomeTotal);
        setExpense(expensesTotal);
        setTotalBalance(incomeTotal - expensesTotal);
      };
      async function reset() {
          if (!user) return;
          console.log("Resetting transactions...");
          try {
              const q = query(collection(db, `users/${user.uid}/transactions`));
              const querySnapshot = await getDocs(q);
              const deletePromises = querySnapshot.docs.map((docItem) => 
                  deleteDoc(doc(db, `users/${user.uid}/transactions`, docItem.id))
              );
              await Promise.all(deletePromises);
              setTransactions([]);
              setIncome(0);
              setExpense(0);
              setTotalBalance(0);
      
              toast.success("All transactions have been reset!");
          } catch (error) {
              console.error("Error resetting transactions: ", error);
              toast.error("Failed to reset transactions.");
          }
      }
      
    return(
        <div>
            {loading?<p>Loading...</p>:<>
                <Header />
                <Cards
                    income={income} 
                    expense={expense}
                    totalBalance={totalBalance}
                    showExpenseModal={showExpenseModal}
                    showIncomeModal={showIncomeModal}
                    reset={reset}
                />
                <AddExpenseModal
                isExpenseModalVisible={isExpenseModalVisible}
                handleExpenseCancel={handleExpenseCancel}
                onFinish={onFinish}
                />
                <AddIncomeModal
                isIncomeModalVisible={isIncomeModalVisible}
                handleIncomeCancel={handleIncomeCancel}
                onFinish={onFinish}
                />
                {transactions.length!==0?(
                  <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
                ):(<NoTransactions />)}
          </>}
        </div>
    );
}

export default Dashboard