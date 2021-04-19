import React, {useState, useEffect} from 'react' 
import styled from 'styled-components'
import exchange from '../images/exchange.svg'
import close from '../images/close.svg'
import Select from 'react-select'
import {BeatLoader} from 'react-spinners'
import axios from 'axios'

const Wrapper = styled.section`
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
    90deg,
    rgba(48, 16, 255, 1) 0%,
    rgba(100, 115, 255, 1) 100%
  );
`

const Form = styled.form`
    position: relative;
    display: flex;
    padding:3rem;
    align-items: center;
    height: max-content;
    background: #161a2b;
    border-radius:0.5rem;
    flex-direction: column;
    &>hr{
        border: none;
        width: 100%;
        height: 0.1rem;
        background-color: white;
        margin: 1.5rem 0;
    }
    &>h1{
        font-size: 2.5rem;
        color: white;
        font-weight: bold;
        text-align: center;
    }
    &>.box{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-items: center;
        &.first{
            margin-bottom: 1.5rem;
        }
    }
    &>.sign{
        position: relative;
        height: 4rem;
        width: 4rem;
        display: grid;
        place-items: center;
        margin-top: 2rem;
        cursor: pointer;
        transition: all 0.3s;
        user-select: none;
        &:active{
            transform: rotate(-10deg)
        }
        & >img{
            height: 100%;
            width: 100%;
            filter: invert(44%) sepia(48%) saturate(2542%) hue-rotate(88deg) brightness(110%) contrast(114%);
        }
    }
` 
const Label = styled.label`
    margin-bottom: 0.8rem;
    font-size: 1.3rem;
    font-weight: bold;
    color: #3eda00;
`
const Amout = styled.input`
    padding-left: 1rem;
    height: 5rem;
    width: 25rem;
    border-radius: 0.2rem;
    border: none;
    &:focus{
        outline: none;
    }
`

const ErrorMessage = styled.aside`
    color: red;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 0.3rem;
    margin: 0.5rem 0;
    margin-bottom: 1rem;
`
const StyledSelect = styled(Select)``
const Submit = styled.button`
    width: 100%;
    padding: 0 1.5rem;
    height: 5rem;
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: black;
    border: none;
    border-radius: 0.2rem;
    background-color: ${({ disabled })=>disabled ? "gray" :  "#f3ba1f"};
    cursor: pointer;
    margin-top: 1.5rem;

`


const styles = {
    control:(provided, state) => ({
        ...provided,
        width: '25rem',
        height: '5rem',
        border: 'none',
        borderRadius: '0.2rem'
    }),
    singleValue: (provided, state) => ({
        ...provided,
        fontSize: "1.5rem",
        fontWeight: 'bolder',
        color: '#dd0000'
    }),
    option: (provided, state) => ({
        ...provided,
        padding: '1rem 1rem',
        fontSize: '1.3rem'
    })
}
const BASE_URL = `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_RATE_API}/latest/USD`

const ConversionWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #161a2b;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    &>span{
        font-size: 2rem;
        margin-bottom: 1rem;
        text-align: center;
    }
    &>p{
        display: block;
        font-size: 3rem;
        color: #3eda00;
        text-align: center;

    }
    &>img{
        position: absolute;
        top: 1.5rem;
        width: 2rem;
        height: 2rem;
        right: 1.5rem;
        filter: invert(100%);
        cursor: pointer;
    }
`

function Converter() {
    const [amount, setAmount] = useState("")
    const [error, setError] = useState(false)
    const [data, setData] = useState('')
    // const [dataError, setdataError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [from, setFrom] = useState("INR");
    const [to, setTo] = useState("USD");
    const [convert, setConvert] = useState("")
    const [cLoading, setcLoading] = useState(false)
    let rates = data &&  data?.conversion_rates;
    // let baseCode = data && data?.base_code;
    // let time = data &&  data?.time_last_update_utc;
    const options = rates && Object.entries(rates).map(([key, value]) => ({ value: key, label: key}))
    function validate(amount) {
        if (!amount.length || !/^-?\d+\.?\d*$/.test(amount)) {
            setError(true)
        } else {
            setError(false)
        }
    }
    const conversion = async (amountForConversion, convertFrom, convertTo) => {
        try {
            setcLoading(true)
            const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_RATE_API}/pair/${convertFrom}/${convertTo}/${amountForConversion}`)
            setConvert(data)
            setcLoading(false)
        } catch (err) {
            setcLoading(false)
            console.log(err)
        }
    } 
    const handleSubmit = (e) => {
        e.preventDefault()
        validate(amount)
        if (!error) {
            conversion(amount, from, to)
        }
    }
    function modal(amount, from, to, value) {
            return (
                <ConversionWrapper>
                    <img onClick={()=>setConvert("")} src={close} alt="close"/>
                    <span>{amount + ' ' + from + " equals to "}</span>
                    <p>{value + ' ' + to}</p>
                </ConversionWrapper>
            )
        }
    const handleChange = (e) => {
        setAmount(e.target.value)
    }
    const handleBlur = () => {
        validate(amount)
    }
    useEffect(() => {
        setLoading(true)
        axios.get(BASE_URL).then(({ data }) => {
            setData(data)
            setLoading(false)
        }).catch(err => {
            if (err) {
                console.error(err)
            }
            setLoading(false)
        })
    }, [])
    const defaultValue = (options, value) => {
        return options ? options.find(option => option.value === value) : {}
    }
    return (
        <Wrapper>
            <Form onSubmit={handleSubmit}>
                <h1>Currency Converter</h1>
                <hr/>
                <div className='box first'>
                    <Label htmlFor="amount">Amount</Label>
                    <Amout
                        id='amount'
                        name="amount"
                        type="text"
                        onChange={handleChange}
                        value={amount}
                        placeholder='Enter amount'
                        onBlur={handleBlur}
                    />
                    {error && <ErrorMessage>{!amount.length ? "Field cannot be empty." : "Enter a valid amount!"}</ErrorMessage>}
                </div>
                <div className='box'>
                    <Label htmlFor="from">From</Label>
                    <StyledSelect
                        id="from"
                        options={options}
                        onChange={option => setFrom(option.value)}
                        value={defaultValue(options, from)}
                        isLoading={loading}
                        styles={styles}></StyledSelect>
                </div>
                <div className="sign" onClick={() => {
                    const tmp = from
                    setFrom(to)
                    setTo(tmp)
                }}>
                    <img src={exchange} alt="sign"/>
                </div>
                <div className='box'>
                    <Label htmlFor="to">To</Label>
                    <StyledSelect
                        id="to"
                        options={options}
                        onChange={option => setTo(option.value)}
                        value={defaultValue(options, to)}
                        isLoading={loading}
                        styles={styles}></StyledSelect>
                </div>
                <Submit type="submit" disabled={error ? true : false}>{cLoading ? <BeatLoader loading={cLoading} color="black" size={10}/> : "Convert"}</Submit>
                {(!cLoading && convert?.conversion_result) && modal(amount, from, to, convert?.conversion_result)}
            </Form>
        </Wrapper>
    )
}

export default Converter
