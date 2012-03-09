<?php

/*
class handling what privilege the user has
*/

class checkPrivilege {
	
	//check privilege for that action and abort if user does not have it; IF $lockCheck = FALSE than no check for lock is needed
	function __construct($userPrivilege,$lockCheck,$user,$lock) {
		//check if user has the right
		if($user->returnPrivilege() >= $userPrivilege){
			//check if lock needs to be checked
			if($lockCheck){
				//check if there is no lock
				if($lock->returnLock() == 0){
					new error(400,USER_NO_PRIVELEGE_NO_LOCK);
					exit();
				}
				if($lock->checkLock($user->returnId())){
					return true;
				} else {
					new error(400,USER_NO_PRIVELEGE);
					exit();
				}
			} else {
				return true;
			}
		} else {
				new error(400,USER_NO_PRIVELEGE);
				exit();
		}
	}

}
?>
