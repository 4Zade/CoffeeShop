import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Input from '../Input';
import Button from '../Button';
import { useAlert } from '../../contexts/AlertContext';

export default function ContactsForm () {
    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm();
    const { successAlert, errorAlert } = useAlert();
    const [email, setEmail] = useState('');

    async function getEmail() {
        try {
          const response = await axios.get('/api/v1/auth/status', { withCredentials: true });

            if(response.data.authorized){
              setEmail(response.data.data.email);
              setValue('email', response.data.data.email);
            }
        } catch (error) {
          console.error('Error:', error);
        }
    }

    useEffect(() => {
        getEmail()
      }, []);

    const onSubmit = async (data: { email: string; subject: string; message: string; }) => {
        try {
            await axios.post('/api/v1/users/contacts', data, { withCredentials: true });
            
            successAlert('Žinutė sėkmingai išsiūsta!')
            setValue('email', '');
            setValue('subject', '');
            setValue('message', '');

          } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
              // Parse Express Validator errors and set them to the form
              const apiErrors = err.response.data.errors;
              apiErrors.forEach((error: { path: string; msg: string }) => {
                  setError(error.path as any, { type: 'manual', message: error.msg });
              });
          } else {
              // Set a general error for unknown issues
              setError("message", { type: "manual", message: "Nepavyko išsiūsti Žinutės. Bandykite dar kartą." });
              errorAlert("Įvyko klaida įkeliant duomenis.");
          }
          }
      };



    return (
        <section>
  <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
      <form className="">
          {/* <div className='border-2'>            
              <input type="email" disabled={disabled}   className='w-[45.5rem] min-w-2/3'  placeholder="name@flowbite.com" required value={email}  onChange={(event) => setEmail(event.target.value)}></input>
          </div> */}
          <Input
            type='email'
            inputName='El. Paštas'
            placeholder='jūsų el. paštas.'
            value={email}
            disabled={true}
            register={register('email')}
          />
          {/* <div className='border-2'>           
              <input type="text" className='w-[45.5rem] min-w-2/3' placeholder="Let us know how we can help you" required value={subject}  onChange={(event) => setSubject(event.target.value)}></input>
          </div> */}
          <Input
            type="text"
            inputName="Tema"
            placeholder="Tema"
            max={64}
            register={register('subject')}
            error={errors.subject?.message as string}
          />
          {/* <div className='border-2'>            
              <textarea className='w-[45.5rem] min-w-2/3' placeholder="Leave a comment..." required  value={message}  onChange={(event) => setMessage(event.target.value)}></textarea>
          </div> */}
          <Input
            type="textarea"
            inputName="Žinute"
            placeholder="Žinute"
            max={1024}
            register={register('message')}
            error={errors.message?.message as string}
          />
          <Button type="submit" onClick={handleSubmit(onSubmit as any)} icon="tabler:send">Send</Button>
      </form>
  </div>
</section>
    )
}