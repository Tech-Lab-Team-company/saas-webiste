class ApiNames {
  private static _instance: ApiNames;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() { }
  public static get Instance(): ApiNames {
    if (!this._instance) {
      this._instance = new ApiNames();
    }
    return this._instance;
  }

  public baseUrl = "https://saas.crazyidea.online/api/website/";
  


  //auth
  public login = "login";
  public register = "register";
  public logout = "logout";
  public VerifyCode = "check_code";
  public VerifyCodePassword = "verify_code";
  public updateProfileImage = "update_profile_image";
  public removeProfileImage = "remove_profile_image";

  //reset password
  public forgotPassword = "forgot_password";
  public resetPassword = "verify_code";
  // public resetPassword = "change_password";

  public setNewPassword = "reset_password";
  
  //Education Stages
  public educationstages =this.baseUrl + "fetch_education_type";
  public educationlevels = "fetch_stages";
  
  
  //Course Details
  public courseDetails = "course_details";
  
  
  //university
  public university = "fetch_universities";
  public colleges = "fetch_colleges";
  public college_department = "fetch_college_departments";
  public college_department_divisions = "fetch_college_department_divisions";
  public submit_education_data = "store_education_data";
  
  // Exams
  public examDetails = "fetch_exam_details";
  public submit_question_answer = "submit_exam_question";



  //user
  public profile = "profile";
  public updateProfile = "update_profile";
  public updatePassword = "change_password";


  // home
  public categories = "categories";
  public subCategories = "fetch_sub_category";
  public categoryTypes = "type_categories";
  public popularCategories = "popular_categories";
  public popularServices = "popular_services";
  public popularServicesByCategory = "popular_services_by_category";
  public services = "services";
  public homeBlogs = "home_blogs";

  //countries
  public countries = "fetch_countries";

  //cities
  public cities = "cities";

  //blog
  public blog = "blog-details";
  public blogComments = "fetch_blog_comments";
  public addBlogComment = "make_comment";

  //listing
  public listings = "my_listings";
  public addListing = "add_listing";
  public updateListing = "update_listing";
  public deleteListing = "delete_listing";
  public listingDetails = "listing_details";
  public viewListing = "view_listing";
  public filterListings = "filter_listings";
  public searchListing = "search_listing";
  public addBookmark = "book_listing";
  public deleteListingImage = "delete_listing_image";
  public updateListingImage = "update_listing_image";
  // public addListingComment = "make_listing_comment";
  // public listingReviews = "fetch_listing_reviews";

  //bookmark
  public bookmarks = "my_bookmarks";

  //reviews
  public reviews = "my_reviews";
  public otherReviews = "other_reviews";
  public deleteReview = "delete_review";
  public reportReview = "report_review";
  public editRate = "edit_review";
  public deleteRateImage = "delete_review_image";
  public voteReview = "vote";
  public inactiveListing = "disactive_listing";


  public addClaim = "add_claim";
  public    addRate = "add_rate";
  public contactUs = "contact_us";

  // chats
  public fetchChats = "fetch_all_chats";
  public fetchChatMessages = "fetch_chat_messages";
  public sendMessage = "send_message";

  // terms
  public fetch_terms = "fetch_terms";
  
  // privacy
  public fetch_privacy = "fetch_privacy";

  // fqs
  public fetch_fqs = "fetch_fqs";

  // blogs card
  public fetch_blogs = "fetch_blogs";

  public show_blog = "show_blog";

  public CoursesFilter = this.baseUrl + "filter_courses";
  public CoursesPayment = this.baseUrl + "join_course";

  public SubmitHomeWork = this.baseUrl + "submit_student_answer";

  
  
  //Courses
  public fetch_courses = "fetch_courses";

}

export { ApiNames };
