package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

const authCookieName = "authAdmin"

type indexPage struct {
	Title           string
	FeaturedPosts   []*featuredPostData
	MostRecentPosts []*mostRecentPostData
}

type postData struct {
	Title         string `db:"title"`
	Subtitle      string `db:"subtitle"`
	Content       string `db:"content"`
	ImgBackground string `db:"image_url"`
}

type featuredPostData struct {
	PostURL     string
	PostID      string `db:"post_id"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	ImgModifier string `db:"image_modifier"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_url"`
	PublishDate string `db:"publish_date"`
}

type mostRecentPostData struct {
	PostURL     string
	PostID      string `db:"post_id"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	ImgPost     string `db:"image_url"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_url"`
	PublishDate string `db:"publish_date"`
}

type createPostRequest struct {
	Title         string `json:"title"`
	Description   string `json:"description"`
	Author        string `json:"author"`
	AvatarName    string `json:"avatarName"`
	Avatar        string `json:"avatar"`
	PublishDate   string `json:"publishDate"`
	PostImageName string `json:"pageImageName"`
	PostImage     string `json:"pageImage"`
	Content       string `json:"content"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func index(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		featuredPostsData, err := featuredPosts(db)
		if err != nil {
			http.Error(w, "Internet Server Error", 500)
			log.Println(err.Error())
			return
		}

		mostRecentPostsData, err := mostRecentPosts(db)
		if err != nil {
			http.Error(w, "Internet Server Error", 500)
			log.Println(err.Error())
			return
		}

		ts, err := template.ParseFiles("pages/index.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := indexPage{
			Title:           "Escape",
			FeaturedPosts:   featuredPostsData,
			MostRecentPosts: mostRecentPostsData,
		}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		log.Println("Request completed successfully")
	}
}

func post(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		postIDStr := mux.Vars(r)["postID"]

		postID, err := strconv.Atoi(postIDStr)
		if err != nil {
			http.Error(w, "Invalid post id", 403)
			log.Println(err)
			return
		}

		post, err := postByID(db, postID)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Post not found", 404)
				log.Println(err)
				return
			}

			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/post.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		err = ts.Execute(w, post)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Request completed successfully")
	}
}

func admin(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := authByCookie(db, w, r)
		if err != nil {
			return
		}

		ts, err := template.ParseFiles("pages/admin.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = ts.Execute(w, nil)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/login.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func createPost(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := authByCookie(db, w, r)
		if err != nil {
			return
		}

		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		var req createPostRequest

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = savePost(db, req)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func logIn(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		var req loginRequest

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		userID, err := findUser(db, req)
		if err != nil {
			http.Error(w, "Incorrect password or email", 401)
			log.Println(err.Error())
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:    authCookieName,
			Value:   fmt.Sprint(userID),
			Path:    "/",
			Expires: time.Now().AddDate(0, 0, 1),
		})

		w.WriteHeader(200)
	}
}

func findUser(db *sqlx.DB, req loginRequest) (int, error) {
	const query = `
		SELECT
			user_id
		FROM
		  ` + "`user`" + `
		WHERE
			email = ? AND
			 ` + "`password`" + ` = ?
	`
	var userID int

	err := db.Get(&userID, query, req.Email, req.Password)
	if err != nil {
		return 0, err
	}

	return userID, nil

}

func logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:    authCookieName,
		Path:    "/",
		Expires: time.Now().AddDate(0, 0, -1),
	})

	w.WriteHeader(200)
}

func authByCookie(db *sqlx.DB, w http.ResponseWriter, r *http.Request) error {
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		if err == http.ErrNoCookie {
			http.Redirect(w, r, "/login", 301)
			return err
		}
		http.Error(w, "Internal Server Error", 500)
		log.Println(err)
		return err
	}

	userIDStr := cookie.Value

	const query = `
        SELECT
            email,
            ` + "`password`" + `
        FROM
            ` + "`user`" + `
        WHERE
            user_id = ?
    `
	var login loginRequest

	err = db.Get(&login, query, userIDStr)
	if err != nil {
		return err
	}

	return nil

}

func postByID(db *sqlx.DB, postID int) (postData, error) {
	const query = `
		SELECT
			title,
			subtitle,
			content,
			image_url
		FROM
			post
		WHERE
			 post_id = ?
	`

	var post postData

	err := db.Get(&post, query, postID)
	if err != nil {
		return postData{}, err
	}

	return post, nil
}

func featuredPosts(db *sqlx.DB) ([]*featuredPostData, error) {
	const query = `
		SELECT
		  post_id,
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_modifier
		FROM
			post
		WHERE featured = 1
	`
	var posts []*featuredPostData

	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	for _, post := range posts {
		post.PostURL = "/post/" + post.PostID
	}

	return posts, nil
}

func mostRecentPosts(db *sqlx.DB) ([]*mostRecentPostData, error) {
	const query = `
		SELECT
		  post_id,
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_url
		FROM
			post
		WHERE featured = 0
	`
	var posts []*mostRecentPostData
	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	for _, post := range posts {
		post.PostURL = "/post/" + post.PostID
	}

	return posts, nil
}

func saveImage(imageName string, imageFile string) error {
	imgPost, err := base64.StdEncoding.DecodeString(imageFile)
	if err != nil {
		return err
	}

	file, err := os.Create(imageName)
	if err != nil {
		return err
	}

	_, err = file.Write(imgPost)
	if err != nil {
		return err
	}

	return nil
}

func savePost(db *sqlx.DB, req createPostRequest) error {
	postImagePath := "static/img/" + req.PostImageName
	avatarPath := "static/img/" + req.AvatarName
	saveImage(postImagePath, req.PostImage)
	saveImage(avatarPath, req.Avatar)

	const query = `
	INSERT INTO
			post
	(
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_url,
			content
	)
	VALUES
	(
			?,
			?,
			?,
			?,
			?,
			?,
			?
	)
`
	_, err := db.Exec(
		query,
		req.Title,
		req.Description,
		req.Author,
		"/"+postImagePath,
		req.PublishDate,
		"/"+avatarPath,
		req.Content,
	)
	return err

}
