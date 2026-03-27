import {useState, FormEvent} from 'react';
import {isPasswordValid} from '@/components/ui/PasswordRequirements'
import { authService } from '@/services/auth.service';
import { RegisterDto, User } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const useSignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState<string| null>('');
    const [isLoading, setIsLoading] = useState(false);
    const {login} =useAuth()

    const handleSignUp = async (e:FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if(!isPasswordValid(password)){
            setError('La contraseña no cumple con los requisitos de seguridad');
            setIsLoading(false);
            return;
        }
        if(password!=confirmPassword){
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }
        if(!acceptedTerms){
            setError('Debes aceptar los terminos y condiciones');
            setIsLoading(false);
            return;
        }
        try{
            const user:RegisterDto= {
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                phoneNumber: phoneNumber
            }
            const data =await authService.signup(user);
            login(data.accessToken, data.user);
        }catch(err:any) {
            console.error('Error en sign up:', err);
            setError(
                err.response?.data?.message ||
                'Error al crear la cuenta. Intenta nuevamente.'
            );
        }finally {
            setIsLoading(false);
        }

    }

    return {
        //Props
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        acceptedTerms,
        error,
        isLoading,
        //Methods
        setFirstName,
        setLastName,
        setEmail,
        setPhoneNumber,
        setPassword,
        setConfirmPassword,
        handleSignUp
        
    }
}