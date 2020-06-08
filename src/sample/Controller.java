package sample;

import java.net.URL;
import java.util.ResourceBundle;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Controller {

    @FXML
    private ResourceBundle resources;

    @FXML
    private URL location;

    @FXML
    private Button openBrowser;

    @FXML
    private Button closeBrowser;

    @FXML
    private Button startRolling;

    @FXML
    private Button startRecaptcha;

    @FXML
    void initialize() {

        //Задаем параметры и путь Chromedriver
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\User\\IdeaProjects\\Freebitcoin/chromedriver.exe");
        //Создаем папку Profile в корне программы
        //Сохраняются все изменения в Chrome Profil-e
        ChromeOptions options = new ChromeOptions();
        options.addArguments("user-data-dir=C:\\Users\\User\\IdeaProjects\\Freebitcoin\\Profile/");
        WebDriver driver = new ChromeDriver(options);
        JavascriptExecutor jsx = (JavascriptExecutor) driver;
        WebDriverWait wait = new WebDriverWait(driver, 5);

        openBrowser.setOnAction(event -> {
            
            driver.get("https://freebitco.in/?r=7361536");
        });

        startRecaptcha.setOnAction(event -> {
            jsx.executeScript("window.scrollBy(0,450)", "");
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("recaptcha-anchor-label")));
            driver.findElement(By.id("recaptcha-anchor-label")).click();
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("solver-button")));
            driver.findElement(By.id("solver-button")).click();
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("free_play_form_button")));
            driver.findElement(By.id("free_play_form_button")).click();
        });

        startRolling.setOnAction(event -> {
            jsx.executeScript("window.scrollBy(0,450)", "");
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("free_play_form_button")));
            jsx.executeScript("window.scrollBy(0,450)", "");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            driver.findElement(By.id("free_play_form_button")).click();
            try {
                Thread.sleep(3625000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        });
        closeBrowser.setOnAction(event -> {

            driver.close();
        });
    }
}


