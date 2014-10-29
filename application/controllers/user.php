<?php

/**
 * Class User
 */
class User extends Base_Controller
{
    public function login()
    {
	    $userModel = new UserModel();
	    /* @var $user IUser */
        $user = $userModel->findByLoginAndPassword($this->input->post('login'), $this->input->post('password'));
        if($user instanceof IUser) {
	        $this->load->getAuth()->setUser($user);
        }
    }

    public function captcha()
    {
        $this->load->helper('captcha');
        $word = $this->generateRandomString();
        $this->session->set_userdata(array('captcha_word' => $word));

        $cap = create_captcha(array(
            'word' => $word,
            'img_path' => FCPATH . 'captcha/',
            'img_url' => '/captcha/',
            'img_width' => 80,
            'img_height' => 30,
            'font_path' => FCPATH . 'fonts/PTS55F.ttf'
        ));

        $this->output->set_content_type('image/jpeg')->set_output(file_get_contents(FCPATH . 'captcha/' . $cap['time'] . '.jpg'));
    }

	/**
	 * @param int $length
	 * @return string
	 */
	protected function generateRandomString($length = 4) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }

    public function logout()
    {
	    $this->load->getAuth()->logout();
        redirect('/', 'location', 301);
    }
}