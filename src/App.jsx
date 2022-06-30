import React, { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react/cjs/react.development';
import './App.css';

// First row of first table(foodTable)
const foodCol1 =
{
  order: 'ردیف',
  name: 'نام غذا',
  price: 'قیمت',
  ingredients: 'جزئیات',
  calery: 'میزان کالری'
}

//Foods Array
const foods = [
  {
    order: '۱',
    name: 'برگر مخصوص',
    Stringprice: '۷۷,۵۰۰ تومان',
    price: 77500,
    ingredients: '۱۵۰ گرم گوشت،سس مخصوص،سالاد سیب زمینی سرخ شده',
    calery: '۹۳۰ کیلو کالری',
    id: 1
  },
  {
    order: '۲',
    name: 'پیتزا بیکن دو نفره',
    Stringprice: '۱۹۳,۰۰۰ تومان',
    price: 193000,
    ingredients: 'خمیر پیتزا آمریکایی،بیکن گوشت۹۰٪،فلفل دلمه،پنیرموزارلا',
    calery: '۲۵۰۰ کیلوکالری',
    id: 2
  },
  {
    order: '۳',
    name: 'پیتزا پپرونی دو نفره',
    Stringprice: '۱۴۸,۵۰۰ تومان',
    price: 148500,
    ingredients: 'خمیر پیتزا آمریکایی،پپرونی،فلفل دلمه،قارچ،پنیر موزارلا',
    calery: '۲۴۴۰ کیلوکالری',
    id: 3
  },
  {
    order: '۴',
    name: 'پیتزا رست بیف دو نفره',
    Stringprice: '۱۸۵,۰۰۰ تومان',
    price: 185000,
    ingredients: 'خمیر پیتزا آمریکایی،گوشت رست،فلفل دلمه،قارچ،پنیرموزارلا',
    calery: '۱۷۶۰ کیلوکالری',
    id: 4
  },
  {
    order: '۵',
    name: 'پیتزا سیسیلی دو نفره',
    Stringprice: '۱۹۸,۰۰۰ تومان',
    price: 198000,
    ingredients: 'خمیر پیتزا آمریکایی،مرغ گریل،سالامی،فلفل دلمه،قارچ،پنیرموزارلا',
    calery: '۲۹۲۰ کیلوکالری',
    id: 5
  },
];

//First row of second table(order food table)
const foodCol2 =
{
  order: 'ردیف',
  name: 'نام غذا',
  price: 'قیمت',
  ingredients: 'جزئیات',
  calery: 'میزان کالری',
  count: 'تعداد',
  delete: 'حذف'
};

function App() {

  //Show order food Table
  const [showOrderFoodTable, setShowOrderFoodTable] = useState('');
  //order foods array
  const [orderFood, setOrderFood] = useState([{
    order: '',
    name: '',
    Stringprice: '',
    price: 0,
    ingredients: '',
    calery: '',
    id: 0,
  }]);

  //resultArray is for calculating total price of order foods
  const [resultArray, setResultArray] = useState([{
    totalPrice: 0,
    count: 0
  }]);

  // total price of order foods
  const [result, setResult] = useState('');

  //Calculating sum of totalPrice*count in resultArray
  const findSum = useCallback(() => {
    let sum = 0;
    for (var i = 0; i < resultArray.length; i++) {
      sum = sum + resultArray[i].totalPrice * resultArray[i].count;
    }
    return sum;
  });

  // useMemo will only recompute sumPrice when one of the element of resultArray has changed. 
  let sumPrice = useMemo(findSum, [resultArray]);

  //calculating total price of order foods
  useEffect(() => {
    let resultArrayCopy = [...resultArray];

    // deleting objects with null count
    let obj = 0;
    const i = resultArrayCopy.findIndex((r) => r.count === "");
    if (i !== -1) {
      obj = resultArrayCopy[i].totalPrice;
    }
    const j = resultArrayCopy.findIndex((r) => r.totalPrice === obj);
    if (i !== -1 && j !== -1) {
      resultArrayCopy.splice(i, 1);
      resultArrayCopy.splice(j, 1);
      setResultArray(resultArrayCopy);
    }

    // If there was duplicate totalPrice in resultArray, remove it
    //because when we had double digits for count,in resultArray once object with count one digit is seting,
    //and once again object with two digits is seting.
    let resultArrayCopy2 = [...resultArray];
    for (var k = 0; k < resultArrayCopy2.length; k++) {
      if (k + 1 < resultArrayCopy2.length) {
        if (resultArrayCopy2[k].totalPrice === resultArrayCopy2[k + 1].totalPrice) {
          resultArrayCopy2.splice(k, 1);
          setResultArray(resultArrayCopy2);
        }
      }
    }
    setResult(sumPrice);
  }, [resultArray]);

  // add to order foods table
  const addOrderFoodTable = useCallback((f) => {
    // deleting element with id = 0 bacause we have an null row in table
    if (orderFood[0].id === 0) {
      orderFood.splice(0, 1);
      setOrderFood({
        order: f.order,
        name: f.name,
        Stringprice: f.Stringprice,
        price: f.price,
        ingredients: f.ingredients,
        calery: f.calery,
        id: f.id
      });
    }
    //This condition checking that if row is existing before in table
    // is not allowing to add table.
    if (orderFood.some(r => r.id === f.id) === false) {
      setShowOrderFoodTable(true);
      setOrderFood([...orderFood, {
        order: f.order,
        name: f.name,
        Stringprice: f.Stringprice,
        price: f.price,
        ingredients: f.ingredients,
        calery: f.calery,
        id: f.id
      }]);
    }
    else
      alert('شما قبلا این غذا را انتخاب نموده اید! لطفا غذای دیگری انتخاب کنید.');
  })

  //Deleting the row clicked on
  const deleteFood = useCallback((id) => {
    //update resultArray when row is deleting
    const ob = orderFood.find(r => r.id === id);
    const resultArrayCopy = resultArray.filter(r => r.totalPrice !== ob.price);
    setResultArray(resultArrayCopy);
    //This condition does not allow the table to be empty
    if (orderFood.length === 1) {
      orderFood.splice(0, 1);
      setOrderFood([...orderFood, {
        order: '',
        name: '',
        Stringprice: '',
        price: 0,
        ingredients: '',
        calery: '',
        id: 0
      }]);
      setShowOrderFoodTable(false);
    }
    else {
      const temp = orderFood.filter(r => r.id !== id);
      setOrderFood(temp);
    }
  });

  //Reset resultArray and orderFood array
  const HandleResetButton = useCallback(() => {
    setShowOrderFoodTable(false);
    let nullResultArray = [{
      totalPrice: 0,
      count: 0
    }]
    let nullOrderFood = [{
      order: '',
      name: '',
      Stringprice: '',
      price: 0,
      ingredients: '',
      calery: '',
      id: 0,
    }];
    setOrderFood(nullOrderFood);
    setResultArray(nullResultArray);
  });

  //Finalizing the purchase and give good message and reset form.
  const HandleClickFinishButton = useCallback(() => {
    if (result === 0 || showOrderFoodTable === false) {
      alert('لطفا سفارش خود را کامل کنید!')
    }
    else {
      var text = `سفارش شما با موفقیت ثبت شد.\nقیمت کل: ${result}`;
      alert(text);
      setShowOrderFoodTable(false);
      let nullResultArray = [{
        totalPrice: 0,
        count: 0
      }]
      let nullFoodOrder = [{
        order: '',
        name: '',
        Stringprice: '',
        price: 0,
        ingredients: '',
        calery: '',
        id: 0,
      }];
      setOrderFood(nullFoodOrder);
      setResultArray(nullResultArray);
    }
  });

  //set count in resultArray 
  const HandleChangeInput = useCallback((event, r) => {
    event.preventDefault();
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      setResultArray([...resultArray, {
        totalPrice: r.price,
        count: event.target.value
      }]);
    }
  });
  return (
    <div>
      <div className='divTable'>
        <table className='foodTable'>
          <thead>
            <tr>
              <th className='rownumber'>{foodCol1.order}</th>
              <th className='preservedWhiteSpace'>{foodCol1.name}</th>
              <th className='preservedWhiteSpace'>{foodCol1.price}</th>
              <th>{foodCol1.ingredients}</th>
              <th className=' preservedWhiteSpace'>{foodCol1.calery}</th>
            </tr>
          </thead>
          <tbody>
            {
              foods.map((r) => (
                <tr onClick={() => addOrderFoodTable(r)}>
                  <td>{r.order}</td>
                  <td className='preservedWhiteSpace'>{r.name}</td>
                  <td className='preservedWhiteSpace'>{r.Stringprice}</td>
                  <td>{r.ingredients}</td>
                  <td className='preservedWhiteSpace'>{r.calery}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <button className='resetButton' onClick={HandleResetButton}>انتخاب مجدد</button>
      <div className='divTable'>
        <table className='orderFoodTable'>
          <thead>
            <tr>
              <th className='rownumber'>{foodCol2.order}</th>
              <th className='preservedWhiteSpace'>{foodCol2.name}</th>
              <th className='preservedWhiteSpace'>{foodCol2.price}</th>
              <th>{foodCol2.ingredients}</th>
              <th className='preservedWhiteSpace'>{foodCol2.calery}</th>
              <th className='rownumber'>{foodCol2.count}</th>
              <th className='rownumber'>{foodCol2.delete}</th>
            </tr>
          </thead>
          {showOrderFoodTable === true ?
            orderFood.map((r) => (
              // I added this key because after delete one row, the count of its next row is changing
              // and takes the count of deleted row. 
              <tbody key={r.id}>
                <tr>
                  <td>{r.order}</td>
                  <td className='preservedWhiteSpace'>{r.name}</td>
                  <td className='preservedWhiteSpace'>{r.Stringprice}</td>
                  <td>{r.ingredients}</td>
                  <td className='preservedWhiteSpace'>{r.calery}</td>
                  <td className='preservedWhiteSpace'><input type="text" onChange={
                    (event) => HandleChangeInput(event, r)}></input></td>
                  <td className='preservedWhiteSpace' style={{ cursor: 'pointer' }}
                    onClick={() => deleteFood(r.id)}>حذف</td>
                </tr>
              </tbody>
            )) : null}
        </table>
      </div>
      <div className='lableDiv'>
        <label id='la'>قیمت کل: {result}
        </label>
      </div>
      <button className='finishButton' onClick={HandleClickFinishButton}>ثبت سفارش</button>
    </div>
  );
};

export default App;